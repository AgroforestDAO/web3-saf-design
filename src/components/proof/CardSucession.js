import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getProofs } from "../../services/firebaseService"; // Ajuste o caminho conforme necessário
import { format } from 'date-fns';

const ExpandMore = styled((props) => {
 const { expand, ...other } = props;
 return <IconButton {...other} />;
})(({ theme, expand }) => ({
 transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
 marginLeft: "auto",
 transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
 }),
}));

// Corrigindo a forma como o safId é acessado
export default function CardSucession({ safId }) {
 const [expanded, setExpanded] = React.useState(false);
 const [data, setData] = useState([]);

 useEffect(() => {
    const fetchProofs = async () => {
      const proofsData = await getProofs(safId); // Corrigindo a chamada para getProofs
      setData(proofsData);
    };
   
    fetchProofs();
 }, [safId]); // Adicionando safId como dependência do useEffect

 const handleExpandClick = () => {
    setExpanded(!expanded);
 };

 if (!data) {
    return <Typography>Você ainda não tem nenhuma foto da Prova de Sucessão. Vá até o Telegram e envie suas fotos para o bot @Proof_Of_Syntropy</Typography>;
 }

 return (
    <Grid container spacing={2}>
       {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4}>
         <Card key={index} sx={{ maxWidth: 345, marginBottom: 2 }}>
           <CardHeader
             avatar={
               <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                 {item.telegramUsername.charAt(0)}
               </Avatar>
             }
             action={
               <IconButton aria-label="settings">
                 <MoreVertIcon />
               </IconButton>
             }
             title={item.telegramUsername}
             subheader={item.title}
           />
           <CardMedia
             component="img"
             height="194"
             image={item.imgURL}
             alt={item.title}
           />
           <CardContent>
             <Typography
               variant="body2"
               color="text.secondary"
               style={{ fontFamily: "Roboto" }}
             >
               {item.description}
             </Typography>
             <Typography
               variant="caption"
               color="text.secondary"
               style={{ fontFamily: "Roboto" }}
             >
               {format(new Date(item.createdAt.toDate()), "dd/MM/yyyy HH:mm")}
             </Typography>
           </CardContent>
           <CardActions disableSpacing>
             <IconButton aria-label="add to favorites">
               <FavoriteIcon />
             </IconButton>
             <IconButton aria-label="share">
               <ShareIcon />
             </IconButton>
             <ExpandMore
               expand={expanded}
               onClick={handleExpandClick}
               aria-expanded={expanded}
               aria-label="show more"
             >
               <ExpandMoreIcon />
             </ExpandMore>
           </CardActions>
           <Collapse in={expanded} timeout="auto" unmountOnExit>
             <CardContent>
               <Typography paragraph>
                 Nome do SAF: {item.safName}
               </Typography>
               <Typography paragraph>
                 Link IPFS: {item.imgURL}
               </Typography>
             </CardContent>
           </Collapse>
         </Card>
         </Grid>
       ))}
    </Grid>
 );
}
