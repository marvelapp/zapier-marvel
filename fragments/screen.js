module.exports = `
fragment screenInfo on ScreenNode {
    id: pk
    externalId
    uuid
    name
    displayName
    createdAt
    modifiedAt
    sourcePlatform
    content {
        ... on ImageScreen {
            filename
            url
            height
            width
        }
    }
    uploadUrl
}
`
