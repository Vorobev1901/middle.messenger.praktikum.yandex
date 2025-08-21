import template from "./template.hbs";
import "./Button.scss";
import Block from "@core/Block";

export type ButtonProps = {
    label: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
    events?: {
        click?: (event: MouseEvent) => void;
    };
};

export default class Button extends Block<ButtonProps> {
    constructor(props: ButtonProps) {
        super(props);
    }

    render(): string {
        return template(this.props);
    }
}
