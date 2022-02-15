import React from 'react'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'


const Userdashboard = () => {
  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20%',
      flexWrap: 'wrap',
    }}
  >
    <Typography style={{ fontFamily: "sans-serif",color:"green", fontSize: 20, fontWeight: "bolder" }}>
      Your account has succesfully verified!!
    </Typography>
  </Box>
  )
}

export default Userdashboard