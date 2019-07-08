const { gqlRequest } = require('../api');

const sample = {
  comment: {
    message: 'hello again',
  },
  error: null,
  ok: true,
};

const perform = (z, bundle) => {
  const query = `
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
    }`;
    const variables = {
      screenPk: bundle.inputData.screenPk,
      message: bundle.inputData.message,
    };


  return gqlRequest(z, bundle, query, variables).then(response => {
      console.log(response);
      const { data, errors } = JSON.parse(response.content);
      if (errors || !data) {
        throw new Error(`Could not create screen: ${errors[0].message}`)
      }
      if (!data.addComment.ok) {
        throw new Error(`Could not create screen: ${data.addComment.error.message}`);
      }

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
