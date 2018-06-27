import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette : {
      divider : "#444",
      appBar : "#0091EA"
    },
    typography : {
      fontFamily : ['Josefin Sans', 'Ubuntu', 'Kalam'],
      title: {
        color : '#ddd',
        // fontSize: 25,
        textTransform:'uppercase'
      },
      display2:{
        color:"#ddd",
      },
      body1:{
        color:"#ddd",
        fontSize:17
      },
    },
    drawer : {
      width: 240
    },
    breakpoints :{

    },
    overrides :{
      MuiTableCell : {
        footer :{
          color:'#999'
        }
      },
      MuiButton: {
        raisedPrimary: {
          color: 'white',
        },
      },
      MuiListSubheader : {
        root: {
          color:'#fff',
          textAlign:'center',
          fontSize:20,
          fontStyle:'italic'
        }
      },
      MuiListItemText : {
        primary: {
          color:'#fff',
          fontSize:20
        },
        dense: {
          fontSize:17
        },
        secondary : {
          color:'#fff',
          fontSize:24
        },
      },
      MuiListItemIcon : {
        root: {
          color:'#ddd',
        }
      },
      MuiListItem : {
        dense: {
          fontSize:20
        }
      },

    }

  })

  export default theme
