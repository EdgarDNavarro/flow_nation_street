export const respOk = (data: unknown) => {
    return { success: true, data }
}

export const respError = (data: unknown) => {
    return { error: true, data }
}