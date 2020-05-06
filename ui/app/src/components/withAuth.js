import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {AUTH_CHECK} from '../consts'


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
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              credentials: 'include'
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