/* globals describe it expect afterEach beforeEach */
const navigation = require("../navigation")
const Metalsmith = require("metalsmith")
const { resolve, dirname } = require("path")
const { fileURLToPath } = require("url")

function fixture(p) {
  return resolve(__dirname, "fixtures", p)
}

const sections = [
  {
    text: "Section 1",
    href: "section-1",
  },
  {
    text: "Section 2",
    href: "section-2",
  },
]

describe("Navigation metalsmith plugin", () => {
  it("should add an object of unique patterns to metalsmith metadata", (done) => {
    const ms = Metalsmith(fixture("navigation/basic"))
    ms.use(navigation()).process((err) => {
      try {
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe("No sections file found")
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should add section navigation to Metalsmith metadata", (done) => {
    const ms = Metalsmith(fixture("navigation/basic"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).not.toBeUndefined()
        expect(nav).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ text: "Section 1", href: "section-1" }),
            expect.objectContaining({ text: "Section 2", href: "section-2" }),
          ]),
        )

        expect(nav).toHaveLength(2)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should add file items to navigation when the path matches a section", (done) => {
    const ms = Metalsmith(fixture("navigation/basic"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav[0].items).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should not add items to navigation when they don't match a section", (done) => {
    const ms = new Metalsmith(fixture("navigation/basic"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).toEqual(
          expect.not.arrayContaining([
            expect.objectContaining({ href: "not-a-section" }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should add a capitalised name based on the parent folder when no menu text is supplied", (done) => {
    const ms = new Metalsmith(fixture("navigation/page-name"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  text: "Pattern name",
                }),
              ]),
            }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should not add items to navigation when the file is in development", (done) => {
    const ms = new Metalsmith(fixture("navigation/in-development"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  filepath: "section-1/in-development",
                }),
              ]),
            }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should not add items to navigation when the file is archived", (done) => {
    const ms = new Metalsmith(fixture("navigation/archived"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  filepath: "section-1/archived",
                }),
              ]),
            }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should not add items to navigation when the file is in a section folder", (done) => {
    const ms = new Metalsmith(fixture("navigation/section-page"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  filepath: "section-1",
                }),
              ]),
            }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should not add items to navigation when the file placement set to none", (done) => {
    const ms = new Metalsmith(fixture("navigation/placed"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  filepath: "section-1/placed",
                }),
              ]),
            }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should add items to navigation with the correct params", (done) => {
    const ms = new Metalsmith(fixture("navigation/all-params"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        expect(nav).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              items: expect.arrayContaining([
                expect.objectContaining({
                  filepath: "section-1/all-params",
                  href: "section-1/all-params",
                  placement: "secondary",
                  text: "All params page",
                  order: 67,
                  topic: "parameters"
                }),
              ]),
            }),
          ]),
        )

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it("should sort items based on order and alphabetically", (done) => {
    const ms = new Metalsmith(fixture("navigation/sorting"))
    ms.use(navigation(sections)).process((err) => {
      try {
        const nav = ms.metadata().navigation

        const expected = expect.arrayContaining([
          expect.objectContaining({
            items: [
              expect.objectContaining({ filepath: "section-1/ccc" }),
              expect.objectContaining({ filepath: "section-1/bbb" }),
              expect.objectContaining({ filepath: "section-1/also-same-order" }),
              expect.objectContaining({ filepath: "section-1/same-order" }),
              expect.objectContaining({ filepath: "section-1/aaa" }),
              expect.objectContaining({ filepath: "section-1/zzz" }),
            ]
          })
        ])

        expect(nav).toEqual(expected)

        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
