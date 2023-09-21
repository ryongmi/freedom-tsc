import Item from '@/components/Item';
import Grid from '@mui/material/Grid';

export default function Page() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Item>1. xs=12 md=6</Item>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Item>2. xs=12 md=6</Item>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <Item>3. xs=12 md=6</Item>
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <Item>4. xs=12 md=6</Item>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Item>5. xs=12 md=8</Item>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Item>6. xs=12 md=4</Item>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
