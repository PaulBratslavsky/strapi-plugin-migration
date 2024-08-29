# Strapi SEO Plugin Migration Notes:

## Strapi Admin JS File

`strapi-admin.js` file required following changes:

## prefixPluginTranslation replacement.

Before:
```js
"use strict";
module.exports = require("./admin/src").default;
```

After:
```js
import admin from "./admin/src";
export default admin;
```

**Strapi Helper Plugin Changes**

```js
import { prefixPluginTranslations } from "@strapi/helper-plugin";
```

Based on the [following](https://docs-next.strapi.io/dev-docs/migration/v4-to-v5/additional-resources/helper-plugin#prefixplugintranslations). It no longer exists.

It is used in

```js
async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
}
```

Two options to deal with this:

1. Create a copy of the function locally and use it.

```js
type TradOptions = Record<string, string>;

const prefixPluginTranslations = (
  trad: TradOptions,
  pluginId: string
): TradOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as TradOptions);
};
```

2. Remove it completely. And use `getTranslation(data)` instead.

```js
import { getTranslation } from './utils/getTranslation';


async registerTrads(app) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: getTranslation(data),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
```

`./utils/getTranslation` file:

``` js
import { PLUGIN_ID } from '../pluginId';
const getTranslation = (id) => `${PLUGIN_ID}.${id}`;
export { getTranslation };

```

You will need to update the `utils/getTrad.js` file and rename it to `getTranslation.js`.

Before:
``` js
import pluginId from '../pluginId';
const getTrad = id => `${pluginId}.${id}`;
export default getTrad;

```

After:
``` js
import { PLUGIN_ID } from '../pluginId';
const getTranslation = (id) => `${PLUGIN_ID}.${id}`;
export { getTranslation };
```

## Plugin ID Import

Before:
``` js
import pluginId from './pluginId';
```

After:
``` js
import { PLUGIN_ID } from './pluginId';
```

`pluginId.js` file changes:

It is now a constant. And is not exported from the package.json file.

``` js
export const PLUGIN_ID = "seo";
```

## Rename Files to JSX or TSX (if using JSX or TSX)

[plugin:vite:import-analysis] Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.

## Design System Import Changes

Before:
``` jsx
import { Box } from '@strapi/design-system/Box';

After:
``` jsx
import { Box } from '@strapi/design-system';
```

**Strapi Helper Plugin Changes**

## Use CMEdit View Data Manager

More [here](https://docs-next.strapi.io/dev-docs/migration/v4-to-v5/additional-resources/helper-plugin#use-cmeditviewdatamanager)

Before:
``` jsx
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
```

``` jsx
  const { modifiedData } = useCMEditViewDataManager();
```

After:
``` jsx

import {
  useDocument,
  useDocumentActions,
  useDocumentLayout,
  useDocumentRBAC,
  useForm,
} from '@strapi/strapi/admin/hooks';

```

This hook is now split into multiple hook for more flexibility.

In the context of this migration this is what we will be using.

``` jsx
import { useForm } from '@strapi/admin/strapi-admin';
const formValues = useForm('ActionName', ({ values }) => values);
```

## Strapi Icons From Design System 2

[plugin:vite:import-analysis] Missing "./Eye" specifier in "@strapi/icons" package
/Users/paulbratslavsky/Desktop/bento/plugin-dev/src/plugins/seo/admin/src/components/CMEditView/RightLinksCompo/Summary/index.jsx

`package.json` file changes:

``` json
  "dependencies": {
    "@strapi/design-system": "^2.0.0-rc.9",
    "@strapi/icons": "^2.0.0-rc.9",
    "react-intl": "^6.6.8"
  },
```

[Strapi Design System 2 Migration Guide](https://design-system-alpha.vercel.app/?path=/docs/getting-started-migration-guides-v1-to-v2--docs)

Import changes and missing icons.

``` jsx
import { ICON_NAME } from '@strapi/icons';

const MyComponent = () => {
  return <ICON_NAME fill="primary700" />;
};
```

Before:
``` jsx
import Eye from '@strapi/icons/Eye';
```

After:
``` jsx
import { Eye } from '@strapi/icons';
```

## Use CMEdit View Data Manager

More [here](https://docs-next.strapi.io/dev-docs/migration/v4-to-v5/additional-resources/helper-plugin#use-cmeditviewdatamanager)

Before:
``` jsx
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
```

``` jsx
  const { allLayoutData, layout, modifiedData } = useCMEditViewDataManager();
```


allLayoutData need to find this replacement

layout is now useDocumentLayout
``` jsx
const {
  edit: { layout, components },
} = useDocumentLayout();
```

modifiedData is now useForm


After:
``` jsx

import {
  useDocument,
  useDocumentActions,
  useDocumentLayout,
  useDocumentRBAC,
  useForm,
} from '@strapi/strapi/admin/hooks';

```