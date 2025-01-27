import dayjs from "dayjs";
import type { AvailabilityModel } from "../models/AvailabilityModel";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore);

export const getCommonDateList = (allAvailabilities: AvailabilityModel[]): AvailabilityModel[] => {

    const participantsAvailabilities = allAvailabilities
        .reduce((acc, curr) => {
            const key = curr.participant_id;
            if (!acc[key]) acc[key] = [];
            acc[key].push(curr);
            return acc;
        }, {} as Record<string, AvailabilityModel[]>);

        const mergedPerParticipant = Object.values(participantsAvailabilities).map(avails => mergeRanges(avails));

        if (mergedPerParticipant.length === 0) return [];
    
        let commonRanges = mergedPerParticipant[0];
        for (let i = 1; i < mergedPerParticipant.length; i++) {
            commonRanges = intersectRanges(commonRanges, mergedPerParticipant[i]);
            if (commonRanges.length === 0) break;
        }
    
        return mergeRanges(commonRanges);
}

const mergeRanges = (ranges: AvailabilityModel[]): AvailabilityModel[] => {
    if (ranges.length === 0) return [];

    const sorted = [...ranges].sort((a, b) =>
        dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf()
    );

    const merged: AvailabilityModel[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const lastMerged = merged[merged.length - 1];

        if (dayjs(current.start_date).isSameOrBefore(dayjs(lastMerged.end_date))) {

            const newEnd = dayjs(current.end_date).isAfter(lastMerged.end_date)
                ? current.end_date
                : lastMerged.end_date;

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
            const start = dayjs(a.start_date).isAfter(b.start_date) ? a.start_date : b.start_date;
            const end = dayjs(a.end_date).isBefore(b.end_date) ? a.end_date : b.end_date;

            if (dayjs(start).isSameOrBefore(end)) {
                result.push({
                    participant_id: '',
                    event_id: '',
                    start_date: start,
                    end_date: end,
                });
            }
        }
    }

    return mergeRanges(result);
}