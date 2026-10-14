import { expect, test } from "@playwright/test";
const appUrl = (route: string) =>
  test.info().project.name === "pages"
    ? `/platforma/#${route}`
    : `/platforma${route}`;
test("resursele și navigarea păstrează prefixul /platforma/", async ({
  page,
}) => {
  if (test.info().project.name === "pages") {
    // Pages nu rescrie rute curate spre index.html: hash-ul este necesar.
    const direct = await page.request.get("/platforma/proiect/scoala-demo-01");
    expect(direct.status()).toBe(404);
  }
  await page.goto(appUrl("/"));
  const links = await page
    .locator("a[href]")
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")!),
    );
  expect(
    links.every(
      (href) => href.startsWith("/platforma") || href.startsWith("#"),
    ),
  ).toBe(true);
  const scripts = await page
    .locator('script[type="module"][src]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("src")!),
    );
  expect(scripts.length).toBeGreaterThan(0);
  expect(scripts.every((src) => src.startsWith("/platforma/"))).toBe(true);
  await page.goto(appUrl("/proiect/scoala-demo-01"));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "De la promisiune la livrare" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "România Construiește — acasă" })
    .click();
  await expect(page).toHaveURL(/\/platforma\/(?:#\/)?$/);
});
test("parcursul Bacău → Școli → proiect → sursă → buletin", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(appUrl("/"));
  await page.getByRole("button", { name: "Școli", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Vezi ce s-a schimbat" }).click();
  await expect(page).toHaveURL(/judet\/bacau\?tema=scoli/);
  await expect(
    page.getByRole("heading", { name: "Județul Bacău" }),
  ).toBeVisible();
  const source = page
    .getByRole("button", { name: "Cum știm?", exact: true })
    .first();
  await source.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Document simulat");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(source).toBeFocused();
  await page
    .getByRole("link", { name: /Săli de clasă pregătite/ })
    .first()
    .click();
  await expect(page).toHaveURL(/proiect\/scoala-demo-01/);
  await expect(
    page.getByRole("heading", { name: "De la promisiune la livrare" }),
  ).toBeVisible();
  await expect(
    page.getByText("Nu avem date despre acest rezultat.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Vezi buletinul acestei teme" }).click();
  await page
    .getByRole("button", { name: "Previzualizează buletinul meu" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Preferințele au fost salvate",
  );
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Școli", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Sănătate", exact: true }),
  ).not.toBeChecked();
  expect(errors).toEqual([]);
});
test("filtrele, linkurile directe și navigarea browserului", async ({
  page,
}) => {
  await page.goto(appUrl("/exploreaza?judet=bacau&tema=toate"));
  await page.getByRole("searchbox").fill("Moinesti");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page).toHaveURL(/q=Moinesti/);
  await page.getByRole("searchbox").fill("inexistent");
  await expect(page.getByRole("article")).toHaveCount(0);
  await page.goto(appUrl("/judet/neamt?tema=mediu"));
  await expect(page.getByText(/Nu avem proiecte demonstrative/)).toBeVisible();
  await page.getByRole("button", { name: "Școli", exact: true }).click();
  await expect(
    page.getByText("Nu avem proiecte demonstrative", { exact: false }),
  ).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/tema=mediu/);
  await page.goto(appUrl("/proiect/inexistent"));
  await expect(
    page.getByRole("heading", { name: "Nu avem această pagină." }),
  ).toBeVisible();
});
test("buletinul nu inventează evenimente pentru o selecție goală", async ({
  page,
}) => {
  await page.goto(appUrl("/buletin?judet=neamt&tema=mediu"));
  await expect(
    page.getByText(
      "Nu există schimbări pentru selecția curentă în cele două versiuni demo.",
    ),
  ).toBeVisible();
});

test("selecțiile multiple și județul buletinului persistă după reîncărcare", async ({
  page,
}) => {
  await page.goto(appUrl("/buletin?judet=bacau&tema=scoli"));
  await page.locator(".preferences-panel select").selectOption("neamt");
  await page.getByRole("checkbox", { name: "Sănătate", exact: true }).check();
  await page
    .getByRole("checkbox", { name: "Progres modificat", exact: true })
    .uncheck();
  await page
    .getByRole("button", { name: "Previzualizează buletinul meu" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Preferințele au fost salvate",
  );
  await expect(page).toHaveURL(/judet=neamt/);
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Școli", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Sănătate", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Progres modificat", exact: true }),
  ).not.toBeChecked();
  await expect(page.locator(".edition-header")).toContainText("Județul Neamț");
});

test("aplicația funcționează când salvarea locală este blocată", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    }),
  );
  await page.goto(appUrl("/buletin?judet=bacau&tema=scoli"));
  await page
    .getByRole("button", { name: "Previzualizează buletinul meu" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Salvarea în browser nu este disponibilă",
  );
  await expect(
    page.getByRole("heading", { name: "Schimbările principale" }),
  ).toBeVisible();
});
test("exporturile sunt descărcabile și conțin marcajul demo", async ({
  page,
}) => {
  await page.goto(appUrl("/verifica"));
  const json = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descarcă JSON" }).click();
  expect((await json).suggestedFilename()).toBe(
    "romania-construieste-demo.json",
  );
  const csv = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descarcă CSV" }).click();
  expect((await csv).suggestedFilename()).toBe("romania-construieste-demo.csv");
});
for (const width of [360, 768, 1440])
  test(`ecrane fără derulare orizontală la ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "/",
      "/judet/bacau?tema=toate",
      "/proiect/scoala-demo-01",
      "/buletin?judet=bacau&tema=scoli",
      "/exploreaza",
      "/verifica",
    ]) {
      await page.goto(appUrl(route));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      if (route === "/" || route.startsWith("/judet/")) {
        await page.screenshot({
          path: test
            .info()
            .outputPath(route === "/" ? "pornire.png" : "briefing.png"),
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
