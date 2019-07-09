module.exports = `
fragment projectData on ProjectNode {
    id: pk
    uuid
    name
    prototypeUrl
    isArchived
    createdAt
    modifiedAt
    passwordProtected
    settings {
        deviceFrame
        portrait
    }
}
`
