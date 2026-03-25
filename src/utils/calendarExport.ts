/**
 * Generate and download a .ics file for a session booking.
 */
export const downloadIcs = (title: string, date: Date, durationMinutes: number, instructor: string) => {
    const start = new Date(date);
    const end = new Date(date.getTime() + durationMinutes * 60000);

    const formatDate = (d: Date) => {
        return d.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SkillTrader//NONSGML v1.0//EN",
        "BEGIN:VEVENT",
        `SUMMARY:SkillTrader: ${title}`,
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `DESCRIPTION:High-frequency concept synchronization with ${instructor}. Join via your SkillTrader dashboard secure portal.`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_Session.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
