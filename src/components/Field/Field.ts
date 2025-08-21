import "./Field.scss"
import Block from "@core/Block";
import template from "./template.hbs";

export type FieldProps = {
    label: string;
    name: string;
    type?: string;
    value?: string;
    placeholder?: string;
    className?: string;
    autocomplete?: string;
    events?: {
        input?: (event: Event) => void;
        focus?: (event: Event) => void;
        blur?: (event: Event) => void;
    };
};

class Field extends Block<FieldProps> {
    constructor(props: FieldProps) {
        super(props);
    }

    render(): string {
        return template(this.props)
    }
}

export default Field;
