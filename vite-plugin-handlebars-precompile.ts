import Handlebars from 'handlebars'
import {PluginOption} from "vite";

export default function handlebarsPrecompile(): PluginOption {
    return {
        name: "vite-plugin-handlebars-precompile",
        transform(src, id) {
            if (id.endsWith(".hbs")) {
                const precompiled = Handlebars.precompile(src)

                // language=javascript
                const code = `
                    import Handlebars from "handlebars/runtime";

                    export default Handlebars.template(${precompiled});
                `

                return {code, map: null}
            }
        },
    };
}
