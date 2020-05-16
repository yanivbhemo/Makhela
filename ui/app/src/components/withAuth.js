import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {AUTH_CHECK} from '../consts'
import Cookies from 'js-cookie';


export default function withAuth(ComponentToProtect) {
    return class extends Component {
        constructor() {
          super();
          this.state = {
            loading: true,
            redirect: false
          };
        }

        componentDidMount() {
          if(!document.cookie) this.setState({loading: false,redirect: true})
          else {
            fetch(AUTH_CHECK, {
              method: 'POST',
              body: JSON.stringify({"token":Cookies.get('token')}),
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'same-origin'
            })
                .then(res => {
                  if (res.status === 200) {
                    this.setState({ loading: false });
                  } else {
                    const error = new Error(res.error);
                    throw error;
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.setState({ loading: false, redirect: true });
                });
          }
        }
        
        render() {
            const { loading, redirect } = this.state;
            if (loading) {
              return null;
            }
            if (redirect) {
                return <Redirect to="/login" />;
            }
            return <ComponentToProtect {...this.props} />;
          }
        }
}