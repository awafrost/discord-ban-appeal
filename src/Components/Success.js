import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";

class Success extends Component {
    render() {
        return (
            <Grid item>
                <h1 style={{textAlign: "center", color: "#00e676"}}>Succès ! Votre demande de débanissement a été soumise aux modérateurs !</h1>
                <h4>Veuillez leur accorder un peu de temps pour examiner votre demande. Abuser de ce système entraînera un bannissement permanent.</h4>
            </Grid>
        );
    }
}

export default Success;
