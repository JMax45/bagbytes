function formatDate(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

class Dashboard {
    constructor() {

    }
    log(text: string) {
        console.log(`[${formatDate(new Date())}] ${text}`);
    }
}

export default Dashboard;