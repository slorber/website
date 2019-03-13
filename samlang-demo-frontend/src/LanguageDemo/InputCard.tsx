import React, { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import styles from './LanguageDemo.module.css';

type Props = { readonly onSubmit: (code: string) => void; };

const initialText = '/* Start to type your program */\n'
  + '/* Add your comments */\n'
  + '/* Press enter to add a new line. */\n';

/**
 * The component of the language demo.
 */
export default function InputCard({ onSubmit }: Props): ReactElement {
  const [text, setText] = React.useState<string>(initialText);
  return (
    <Card className={styles.ParallelCard}>
      <CardHeader title="Your Program" />
      <CardContent>
        <TextField
          label="SAMLANG Program Code"
          multiline
          fullWidth
          value={text}
          onChange={e => setText(e.currentTarget.value)}
          margin="normal"
          helperText="SAMLANG Program Code"
          variant="outlined"
        />
      </CardContent>
      <CardActions className={styles.GameCardControls}>
        <Button size="medium" color="primary" onClick={() => onSubmit(text)}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}