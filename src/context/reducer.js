export const initialState = {
  user: null,
};

console.log("matt is a dumb bitch");

const reducer = (state, action) => {
  console.log({ action });

  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "LOGOUT":
      return {
        ...initialState,
      };
    default:
      return;
  }
};

export default reducer;
