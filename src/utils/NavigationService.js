import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function goBack(params) {
  _navigator.dispatch(
    NavigationActions.back({
      params
    })
  );
}

function resetWithAction(routeName, params = {}) {
  const resetAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName: 'InventoryTabNavigator',
        action: NavigationActions.navigate({ routeName })
      })
      // NavigationActions.navigate({ routeName })
    ]
  });

  _navigator.dispatch(resetAction);
}

function popToTop() {
  _navigator.dispatch(StackActions.popToTop());
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  resetWithAction,
  popToTop
};
