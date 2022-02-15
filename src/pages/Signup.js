import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import {emailContext} from "../context/emailContext"
import DialogBox from "../components/DialogBox";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Serverless-OTP-system
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles({
  pap: {
    padding: 30,
    height: "40vh",
    width: 380,
    margin: "150px auto",
  },
});

const Signup = () => {
  const {email, setEmail} = useContext(emailContext);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // const onSubmit = (data) => console.log(data);

  const classes = useStyles();
  let navigate = useNavigate();
  const Submit = (e) => {
    e.preventDefault();
    const values = {
      Mail: email,
    };
    console.log('values',values)
    axios.post(
        "https://qt6awdto47.execute-api.ap-south-1.amazonaws.com/prod/generate",
        values
      )
      .then((data) => {
        console.log(data);
        if (data.data.statusCode === 200) {
          navigate("/Verify");
        }else {
          setMessage(data.data.body);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Grid align="center">
        <Paper className={classes.pap} elevation={10}>
          <Grid align="center">
            <Avatar style={{backgroundColor:"green"}}>
              <LockOutlinedIcon />
            </Avatar>
            <h1 style={{ fontFamily: "monospace" }}>Create Account</h1>
          </Grid>
          <form onSubmit={Submit}   >
            <TextField
              id="outlined-basic"
              label="email"
              variant="outlined"
              fullWidth
              onChange= {(e)=>{
                setEmail(e.target.value);
              }}
              // {...register("email", {
              //   required: "Required",
              //   pattern: {
              //     value: /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/,
              //     message: "Invalid email address",
              //   },
              // })}
              // error={!!errors?.email}
              // helperText={errors?.email ? errors.email.message : null}
            ></TextField>

            <Grid margin={5} align="center">
              <Button
                style={{ backgroundColor: "rgba(0,0,255,0.8)" }}
                // onClick={() => {
                //   navigate("/verify");
                // }}
                
                type="submit"
                variant="contained"
                
              >
                SignUp
              </Button>
              <DialogBox open={open} message={message} setOpen={setOpen}/>
            </Grid>
          </form>
        </Paper>
        <Copyright
          style={{ marginTop: "10%", color: "black" }}
          sx={{ mt: 5 }}
        />
      </Grid>
    </div>
  );
};

export default Signup;
