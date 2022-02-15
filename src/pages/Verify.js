import React from 'react';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import { Avatar } from "@mui/material";
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import InputAdornment from '@mui/material/InputAdornment'
import KeyIcon from '@mui/icons-material/Key';
import { emailContext } from '../context/emailContext';
import axios from "axios";
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import DialogBox from "../components/DialogBox";


const useStyles = makeStyles({
  pape: {
    padding: 30,
    height: '30vh',
    width:380,
    margin: "180px auto"
  
  
    }


})


const Verify = () => {
  const { email } = useContext(emailContext);
  const [otp,setOtp]= useState();
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  let navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
   

    const values = {
      email: email,
      Otp: otp,
    };

    console.log(values);
    console.log('otp',otp)
    axios
      .post(
        "https://qt6awdto47.execute-api.ap-south-1.amazonaws.com/prod/verify",
        values
      )
      .then((data) => {
        console.log(data);
        if (data.data.statusCode === 200) {
          navigate("/Userdashboard");
        }else {
          
          setMessage(data.data.responseBody);
          setOpen(true);
        }

        
        
      })
      .catch((err) => {
        console.log(err);
      });

  };


  return <div>
 <Grid>
       <Paper
        className={classes.pape}
       
       elevation={10}>
         <Grid align="center">
            <Avatar style={{backgroundColor:"green"}}>
              <LockOpenOutlined />
            </Avatar>
            
          </Grid>
         <form onSubmit={handleSubmit} > 
          <TextField id="outlined-basic" label="OTP" variant="outlined" fullWidth
          placeholder='Enter otp'
          style={{marginTop:"30PX"}}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            ),
          }}
          >

          </TextField>
          <Grid margin={5} align='center'>
          <Button type="submit" variant="contained">Verify</Button>
          <DialogBox open={open} message={message} setOpen={setOpen}/>
          </Grid>
          </form>
       </Paper>

      </Grid>


  </div>;
};

export default Verify;
