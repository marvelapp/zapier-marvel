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
                message
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
      const parsedData = JSON.parse(response.content);

      return {
        message: parsedData.data.addComment.comment.message,
      };
    });
};

module.exports = {
  key: "addCommentToScreen",
  noun: "Comment",

  display: {
    label: "Add a Comment to a Screen",
    description: "Add a Comment to a Screen"
  },

  operation: {
    sample,
    perform,
    inputFields: [
      { key: "screenPk", label: "Screen PK", required: true },
      { key: "message", label: "Comment", required: true },
    ],
    outputFields: [
      { key: "message", label: "Comment" },
    ]
  }
};
