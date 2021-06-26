import React, { useState, useEffect } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom"
import useStyles from "./styles";
import AdressForm from "../AdressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";

const steps = ["Shipping adress", "Payment details"];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const classes = useStyles();
  const history = useHistory();

  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [isFinished, setIsFinished] = useState(false)


  //FORM
  const Form = () =>
    activeStep === 0 ? (
      <AdressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        nextStep={nextStep}
        timeout={timeout}
      />
    );


    // TIMEOUT
const timeout = ()=> {
  setTimeout(() => {
      setIsFinished(true)
  }, 3000);
}


    //CONFIRMATION
  let Confirmation = () => order.customer ? (
    <>
    <div>
      <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
      <Divider className={classes.divider}/>
      <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
    </div>
    <br/>
    <Button variant="outlined" type="button" component={Link} to="/">Back to home</Button>
    </>
    ) : isFinished ? (
      <>
      <div>
        <Typography variant="h5">Thank you for your purchase.</Typography>
        <Divider className={classes.divider}/>
      </div>
      <br/>
      <Button variant="outlined" type="button" component={Link} to="/">Back to home</Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    )

    if(error) {
      <>
      <Typography variant="h5">Error: {error}</Typography>
      <br/>
      <Button variant="outlined" type="button" component={Link} to="/">Back to home</Button>

      </>
    } 



//USE EFFECTS
  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });

        setCheckoutToken(token);
      } catch (error) {
       history.push('/')
      }
    };
    generateToken(); // in useeffect you cant use async unless it is in a separated function
  }, [cart]);




  //NEXT AND BACK BUTTONS

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);

    nextStep();
  };



  //APP

  return (
    <>
    <CssBaseline/>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
