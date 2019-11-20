# Changelog

## Unreleased

## [1.9.0] - 2019-11-20

### Fixed
- Copy and style issues on 'Install HMRC Frontend in an old version of the GOVUK prototype Kit' page [0f8937e](0f8937e98ca5e8ceb89292c15d63d05356fa37ec)

## [1.8.0] - 2019-10-15

### Updated
- govuk-frontend and hmrc-frontend dependencies [61bf295](61bf295564e10f74e411be9b6bd2ff912b0cebd9)

## [1.7.1] - 2019-09-30

### Fixed
- Full width sub-menu and show HTML / Nunjucks tabs in mobile view [2b42104](2b42104f4326dab8d26683e93b59c3eee87c8db6)

## [1.7.0] - 2019-09-24

### Added
- GOVUK content guide pages [5053834](5053834a4c738bc75aa79edd37d7742574a644f0)

### Changed
- Navigation to create seperate navigation sections [1a5e270](1a5e270adaff9371fd8301491d4d66b89832c950)

## [1.6.0] - 2019-09-23

### Updated
- Text on style guide page [4691e6b](4691e6b7bcae7596a861a75f40d6d2775f84de5c)

### Added
- Javascript for Accordion to open hidden sections if hidden content is linked to [e5144a6](e5144a68ed904b187b12e10b8cff480beb819288)

## [1.5.0] - 2019-09-11

### Updated
- `hmrc-frontend` and `govuk-frontend` dependencies [609a969](609a969a3fa0dab0ceabad6b2e16b13d6e5d5e38)

## [1.4.0] - 2019-09-11

### Changed
- Move livereload to trigger on recompile [0e54b98](0e54b986df4ac13b677d1c383be791b536ccb3d7)

## [1.3.0] - 2019-09-03

### Changed
- Require explicit naming of pattern example location and remove 'default' functionality [f955182](f9551828a4445ebb0523b70915e82a990af53301)

## [1.2.0] - 2019-08-23

### Added
- Phase banner macro driven by developer flag on pattern pages [7e8a9a1](7e8a9a1e5df89cc49680bd74902ef45c08cdc491)

## [1.1.3] - 2019-08-22

### Fixed
- Missing closing element causing validation errors [699f7a9](699f7a98c9c6d199e011ef386bbdc13217b303ea)

### Updated
- Accessibility test tool for more thorough testing, added additional ignore rules for all patterns page and fixed failing landmark issue [bff7313](bff731396c09c23d142f21b79d04f567fd6f254e)

## [1.1.2] - 2019-08-22

### Removed
- A redundant 'TODO' comment [0a51262](0a51262734b95ff5cdf12aafeda93288e7feb4fa)

### Updated
- `hmrc-frontend` to version 1.0.4 and removed now redundant Javascrit hack to prevent collapse of menu in account header example [746abd0](746abd0aae8073f44e1f67d6eba9c66e245a68eb)

## [1.1.1] - 2019-08-20

### Added
- Banner to notify of breaking changes in design systems and offer channel for assistance [7a4b72d](7a4b72d6f5a9c2784d21e374ccaf8e9d81dec6de)

## [1.1.0] - 2019-08-20

### Changed
- Abstracted markup for 'copy' button to Macro [b55ef2f](b55ef2fe4948c4ed50a112a99922d89352e851ac)

### Added
- New htmlOnly developer flag to disable Nunjucks tab in examples [9eaf39d](9eaf39dcdfe16c11ca372322a13b6f3899208c1b)

### Fixed
- Issue with watcher and 'generate-examples' gulp tasks creating race condition [3fed1b4](3fed1b4a238442454f3d8a3bd6859b2daa4006f0)

## [1.0.1] - 2019-08-19

### Updated
- hmrc-frontend package to accessible version [d60284a](d60284afe98abc77c1ebccfb9806bed579af5c6a)

### Added
- Integrate axe-core for accessibility testing and accessibility test pages [ac6d118](ac6d1188062c824ceefb81d86f7b7131cff7cb52)

- Compile all featured patterns into single page for accessibility testing [2a4390b](2a4390bf9178a26c5c777f53c4ef187d0e16bd0d)

### Changed
- Switched background color of cookie banner to accessible value [12c8333](12c83334c89753bd1d78a495f1fabd549c54f873)

## 1.0.0 (Alpha release)

- Updated `govuk-frontend` and `hmrc-frontend` to latest versions [6715837](67158371bb978db43c2af94fb32b389ab358626b)

- Updated paths to assets to acomodate new namespacing rules implemented by the above [81c0181](81c018150de41d755d3a0f72647aa2f66721e8f3) and [3029b7c](3029b7ca8501308d5a71a19488d2c166df72c3e9)

- Fixed deprectaed SASS mixins and variables [1a29bb3](1a29bb30bc12f14074c7b7a70de0d643ddb91880)

- Updated all `govuk-frontend` and `hmrc-frontend` template and layout paths [6cbe9b8](6cbe9b850e44346f13741bf6d5399861610c7340)

- Updated usage messaging [f3ae33](f3ae337f9e527ee0d9574a63881a22b5f6170886)