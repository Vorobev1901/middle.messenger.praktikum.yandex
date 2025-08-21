declare module "*.hbs" {
    import { TemplateDelegate } from "handlebars";
    const template: TemplateDelegate<any>;
    export default template;
}
