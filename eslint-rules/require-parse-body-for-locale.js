module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce parseBody usage when body contains locale",
    },
    messages: {
      useParseBody:
        "Use parseBody() instead of req.json() when the body contains 'locale'. This ensures locale is normalized to lowercase.",
    },
  },
  create(context) {
    return {
      AwaitExpression(node) {
        const call = node.argument;
        if (
          call?.type !== "CallExpression" ||
          call.callee?.type !== "MemberExpression" ||
          call.callee.property?.name !== "json"
        )
          return;

        const parent = node.parent;
        if (parent?.type === "VariableDeclarator") {
          const id = parent.id;
          if (
            id?.type === "ObjectPattern" &&
            id.properties.some(
              (p) => p.type === "Property" && p.key?.name === "locale",
            )
          ) {
            context.report({ node, messageId: "useParseBody" });
          }
        }
      },
    };
  },
};
