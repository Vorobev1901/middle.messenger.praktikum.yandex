import "@styles";
import Button from "@components/Button";
import Field from "@components/Field";

const app = document.getElementById("app");

if (app) {
    const button = new Button({
        label: "Нажми меня",
        type: "button",
        events: {
            click: () => console.log("Клик! 🚀"),
        },
    });

    const field = new Field({
        label: "Логин",
        name: "login",
        type: "text",
        placeholder: "Введите логин",
        autocomplete: "username",
    })

    app.appendChild(button.getContent()!);
    button.dispatchComponentDidMount();

    app.appendChild(field.getContent()!)
    field.dispatchComponentDidMount();
}
