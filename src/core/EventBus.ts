type Listener<T extends any[] = any[]> = (...args: T) => void;

class EventBus<Events extends Record<string, any[]>> {
    private listeners: {
        [K in keyof Events]?: Listener<Events[K]>[];
    } = {};

    public on<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(callback);
    }

    public off<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${String(event)}`);
        }
        this.listeners[event] = this.listeners[event]!.filter(
            (listener) => listener !== callback
        );
    }

    public emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${String(event)}`);
        }
        this.listeners[event]!.forEach((listener) => listener(...args));
    }
}

export default EventBus
