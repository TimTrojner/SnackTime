let defaultState2: any = new Map();

let cartReducer = (state = defaultState2, action: any) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      if (action.payload.checked) {
        if (state.has(action.payload.restaurantName)) {
          state.get(action.payload.restaurantName)?.push(action.payload.item);
        } else {
          state.set(action.payload.restaurantName, [action.payload.item]);
        }
      } else {
        state
          .get(action.payload.restaurantName)
          ?.splice(
            state.get(action.payload.restaurantName)?.indexOf(action.payload),
            1
          );
        if (state.get(action.payload.restaurantName)?.length === 0) {
          state.delete(action.payload.restaurantName);
        }
      }
      return state;
    }
    case "CLEAR_CART": {
      let res_name = action.payload.restaurantName;
      state.delete(res_name);
    }

    default:
      return state;
  }
};

export default cartReducer;
