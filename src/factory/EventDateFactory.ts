import dayjs from "dayjs";
import type { AvailabilityModel } from "../models/AvailabilityModel";

export const getCommonDateList = (allAvailabilities: AvailabilityModel[]): AvailabilityModel[] => {
    // Agrupar disponibilidades por participante
    const participantsAvailabilities = allAvailabilities
        .reduce((acc, curr) => {
            const key = curr.participant_id;
            if (!acc[key]) acc[key] = [];
            acc[key].push(curr);
            return acc;
        }, {} as Record<string, AvailabilityModel[]>);

    // Fusionar rangos de cada participante
    const mergedPerParticipant = Object.values(participantsAvailabilities).map(avails => mergeRanges(avails));

    // Calcular intersección de todos los rangos fusionados
    if (mergedPerParticipant.length === 0) return [];

    let commonRanges = mergedPerParticipant[0];
    for (let i = 1; i < mergedPerParticipant.length; i++) {
        commonRanges = intersectRanges(commonRanges, mergedPerParticipant[i]);
        if (commonRanges.length === 0) break;
    }

    return commonRanges;
}

const mergeRanges = (ranges: AvailabilityModel[]): AvailabilityModel[] => {
    if (ranges.length === 0) return [];

    // Ordenar rangos por start_date
    const sorted = [...ranges].sort((a, b) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf());
    const merged = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const lastMerged = merged[merged.length - 1];

        if (dayjs(current.start_date).isBefore(dayjs(current.end_date)) || dayjs(current.start_date).isSame(dayjs(current.end_date))) {
            // Fusionar rangos superpuestos o adyacentes
            const newEnd = current.end_date > lastMerged.end_date ? current.end_date : lastMerged.end_date;
            merged[merged.length - 1] = {
                ...lastMerged,
                end_date: newEnd,
            };
        } else {
            merged.push(current);
        }
    }

    return merged;
}

const intersectRanges = (rangesA: AvailabilityModel[], rangesB: AvailabilityModel[]): AvailabilityModel[] => {
    const result: AvailabilityModel[] = [];

    for (const a of rangesA) {
        for (const b of rangesB) {
            const start = a.start_date > b.start_date ? a.start_date : b.start_date;
            const end = a.end_date < b.end_date ? a.end_date : b.end_date;

            if (start <= end) {
                result.push({
                    participant_id: '',
                    event_id: '',
                    start_date: start,
                    end_date: end,
                });
            }
        }
    }
    return result;
}