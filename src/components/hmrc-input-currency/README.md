# EE-INPUT--CURRENCY Documentation

This macro generates an `<input>` and `<label>`.

## Variables

```
name
id
label
hint
value
error
maxlength
classes
```

## Descriptions of variables

| Name          | Description                                                   |
| ------------- |---------------------------------------------------------------|
| name          | sets the name of the input                                    |
| id            | sets the id of the input, and the for of the label            |
| label         | sets the text of the label                                    |
| hint          | sets hint text within the label                               |
| value         | sets the value of the input                                   |
| error         | sets the error message                                        |
| maxlength     | sets the max length of the input                              |
| classes       | object used for styling elements                              |

With hint, error and maxlength if the values are empty, then they are not displayed in the render.

## Classes

You can add various styles to the elements within the macro.

| Name          | Description                                                   |
| ------------- |---------------------------------------------------------------|
| label         | this overrides the form-label-bold                            |
| input         | adds addtional classes to the input                           |

These are supplied as a string i.e `{label: 'form-label', input: 'new-class new-class-two'}`.

## Using with express

You will need to expose the views to the nunjucks config, an example is below.

```javascript

const appViews = [path.join(__dirname, '/app/views/'),
                  path.join(__dirname, '/node_modules/govuk-elements-nunjucks/components/'),
                  path.join(__dirname, '/lib/')]

const nunjucksAppEnv = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})
```

## Example in use
Include the nunjucks macro and render it like so:

```
{% from 'gov-input/macro.njk' import govInput %}

{{ govInput('input', 'This is a label') }}
```

## Links

- [nunjucks](https://mozilla.github.io/nunjucks/)
- [nunjucks with node](https://mozilla.github.io/nunjucks/getting-started.html)
- [GOVUK elements](https://github.com/alphagov/govuk_elements)
- [GOV.UK frontend toolkit](https://github.com/alphagov/govuk_frontend_toolkit)