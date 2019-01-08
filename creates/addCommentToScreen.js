const sample = {
  comment: {
    message: 'hello again',
  },
  error: null,
  ok: true,
};

const perform = (z, bundle) => {
  return z
    .request({
      method: 'POST',
      url: 'https://api.marvelapp.com/graphql',
      body: {
        query: `
          mutation zapierAddComment($message: String!, $screenPk: Int!) {
            addComment(input: { message: $message, screenPk: $screenPk }) {
              ok
              comment {
                id: pk
                message
                createdAt
                author {
                  username
                  email
                }
              }
              error {
                message
                code
              }
            }
          }
        `,
        variables: {
          screenPk: bundle.inputData.screenPk,
          message: bundle.inputData.message,
        }
      }
    })
    .then(response => {
      const { data } = JSON.parse(response.content);
      const comment = data.addComment.comment;
      return {
        id: comment.id,
        message: comment.message,
        createdAt: comment.createdAt,
        authorUsername: comment.author.username,
        authorEmail: comment.author.email,
      }
    });
};

module.exports = {
  key: "addCommentToScreen",
  noun: "Comment",

  display: {
    label: "Leave a Comment on a Screen",
    description: "Leave a comment on a screen"
  },

  operation: {
    sample,
    perform,
    inputFields: [
      { key: "screenPk", label: "Screen PK", required: true },
      { key: "message", label: "Comment", required: true },
    ],
    outputFields: [
      { key: "id", label: "ID" },
      { key: "message", label: "Comment" },
      { key: "createdAt", label: "Created At" },
      { key: "authorUsername", label: "Author Username" },
      { key: "authorEmail", label: "Author Email" },
    ]
  }
};
