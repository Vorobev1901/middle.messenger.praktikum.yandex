import EventBus from "@core/EventBus";

type Props = Record<string, any>;

type BlockEvents<P = Props> = {
    init: [];
    "flow:component-did-mount": [];
    "flow:component-did-update": [oldProps: P, newProps: P];
    "flow:render": [];
};

abstract class Block<P extends Props = Props> {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render",
    } as const;

    private _element: HTMLElement | null = null;
    protected props: P;
    private readonly eventBus: () => EventBus<BlockEvents<P>>;

    protected constructor(props: P = {} as P) {
        const eventBus = new EventBus<BlockEvents<P>>();

        this.props = this._makePropsProxy(props);
        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private _registerEvents(eventBus: EventBus<BlockEvents<P>>): void {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    protected init(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    private _componentDidMount(): void {
        this.componentDidMount();
    }

    protected componentDidMount(_oldProps?: P): void {}

    public dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(oldProps: P, newProps: P): void {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }
        this._render();
    }

    protected componentDidUpdate(oldProps: P, newProps: P): boolean {
        return !this._shallowEqual(oldProps, newProps);
    }

    public setProps = (nextProps: Partial<P>): void => {
        if (!nextProps) {
            return;
        }
        Object.assign(this.props, nextProps);
    };

    public get element(): HTMLElement | null {
        return this._element;
    }

    private _render(): void {
        const block = this.render();

        if (typeof block === "string") {
            const template = document.createElement("template");
            template.innerHTML = block.trim();
            const newElement = template.content.firstElementChild as HTMLElement;

            if (!newElement) {
                throw new Error("Шаблон должен возвращать корневой элемент");
            }

            if (this._element) {
                this._removeEvents();
                this._element.replaceWith(newElement);
            }

            this._element = newElement;
        } else if (block instanceof HTMLElement) {
            if (this._element) {
                this._removeEvents();
                this._element.replaceWith(block);
            }
            this._element = block;
        }

        this._addEvents();
    }

    protected abstract render(): string | HTMLElement;

    public getContent(): HTMLElement | null {
        return this.element;
    }

    private _makePropsProxy(props: P): P {
        const self = this;

        return new Proxy(props, {
            get(target: P, prop: string) {
                if (prop.startsWith("_")) {
                    throw new Error("Нет прав");
                }

                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target: P, prop: string, value: any) {
                if (prop.startsWith("_")) {
                    throw new Error("Нет прав");
                }
                const oldProps = { ...target };
                target[prop as keyof P] = value;
                self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
                return true;
            },
            deleteProperty() {
                throw new Error("Нет прав");
            },
        });
    }

    _addEvents() {
        const {events = {}} = this.props;

        Object.keys(events).forEach(eventName => {
            this._element?.addEventListener(eventName, events[eventName]);
        });
    }

    private _removeEvents() {
        const { events = {} } = this.props;

        Object.keys(events).forEach(eventName => {
            this._element?.removeEventListener(eventName, events[eventName]!);
        });
    }

    public show(): void {
        if (this._element) {
            this._element.style.display = "block";
        }
    }

    public hide(): void {
        if (this._element) {
            this._element.style.display = "none";
        }
    }

    private _shallowEqual(obj1: P, obj2: P): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        return keys1.every((key) => obj1[key] === obj2[key]);
    }
}

export default Block;
