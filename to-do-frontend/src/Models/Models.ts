export type ToDo = {
    id: number,
    text: string,
    done: boolean
    priority: string
    creationDate: string,
    dueDate: string | null,
    doneDate: string | null,
}

export type TimeMetrics = {
    toDosCount: number,
    toDosAverageTime: string | null,
    highToDosAverageTime: string | null,
    mediumToDosAverageTime: string | null,
    lowToDosAverageTime: string | null
}

export type ToDosInfo = {
    possiblePages: number,
    searchPages?: number,
    toDos: ToDo[],
    timeMetrics: TimeMetrics
}