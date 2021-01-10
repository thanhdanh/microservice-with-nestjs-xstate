import { Route, Switch } from 'react-router-dom';
import Notfound from './components/Notfound';
import OrderDetail from './components/OrderDetail';
import Orders from './components/Orders';
import Dashboard from './components/Dashboard';
import { BackTop } from 'antd';
import "./../styles.css";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/orders" component={Orders} />
        <Route path="/orders/:id" component={OrderDetail} />
        <Route component={Notfound} />
      </Switch>
      <BackTop />
    </div>

  );
}

export default App;
