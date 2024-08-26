export function getTime(): string{
    const date = new Date();
    return  date.getDate() + "/" + date.getMonth() + ":" + date.getHours() + ":" + date.getMinutes()
}