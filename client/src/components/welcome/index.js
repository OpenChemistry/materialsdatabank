import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import './index.css'

const style = {
    paper: {
      display: 'flex',
      float: 'right',
      margin: '20px 32px 16px 0',
      height: '80%'
    }
};

export default class Welcome extends Component {

  render = () => {
    return (
      <Paper style={style.paper}>
        <div style={{margin: '20px'}}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ante elit, rhoncus ac arcu nec, ornare placerat nibh. Vivamus ultrices
            molestie nunc, eget convallis ligula congue vel. Fusce quis metus non nulla fringilla pharetra. Aenean in purus arcu. Donec viverra et
            ante eu dapibus. In eget felis orci. In hac habitasse platea dictumst. Morbi et pharetra augue. Fusce ac convallis sapien. Nunc vitae
            turpis ac ante elementum cursus. Phasellus iaculis sem vel metus commodo efficitur. Donec bibendum tristique leo, et consequat eros imperdiet
            a. Mauris laoreet scelerisque est et varius. Phasellus sit amet urna eu nisi vestibulum scelerisque nec ac nunc.
          </p>

          <p>
            Maecenas pretium ut nunc ut varius. Curabitur pellentesque bibendum justo viverra euismod. Fusce vel orci volutpat, vehicula lacus quis,
            tristique sapien. Curabitur rhoncus justo vel neque porttitor, nec consequat leo luctus. Pellentesque nulla orci, feugiat eget finibus ac,
            scelerisque ac velit. Fusce iaculis ante ac risus pharetra, consequat tincidunt augue pellentesque. Vestibulum ultrices tempor placerat.
          </p>

          <p>
            Maecenas pharetra pretium posuere. Quisque quis nisl nec tellus convallis ornare. Aliquam et suscipit erat. Vivamus rhoncus hendrerit
            sapien vel sodales. Nam nunc velit, pharetra vel varius vel, ullamcorper in lorem. Vestibulum sagittis lorem quis imperdiet ultrices.
            Curabitur eleifend ante sed lectus dapibus pretium. Aliquam pellentesque, lectus ultricies venenatis viverra, lorem erat rutrum nisi, vitae
            interdum tellus libero eu lorem. Duis vel egestas urna. Etiam fringilla lacus sed ultricies pretium. Proin ut iaculis sapien.
          </p>

          <p>
            Vestibulum sollicitudin felis sed velit elementum luctus. Phasellus tellus metus, bibendum et enim at, cursus posuere massa. Sed scelerisque
            congue purus sit amet pellentesque. Sed non tincidunt lorem. Vestibulum tincidunt consectetur quam eget rhoncus. Donec scelerisque mauris eget
            fringilla ultrices. Donec ultrices enim mauris, in venenatis dui porta sit amet. Morbi finibus sapien sed lectus facilisis malesuada. Donec quis
            enim tempor lorem lobortis aliquet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut id commodo libero, et accumsan dui. Aenean
            et maximus tortor. Donec rutrum, magna non tempus dignissim, mi magna sagittis libero, sodales mattis magna odio id odio.
          </p>

          <p>
            Fusce ac dolor quis ante consectetur tincidunt quis sed urna. Proin mauris diam, pulvinar vitae dui eget, ultricies pharetra mauris. Praesent
            ultrices porta sollicitudin. Nulla facilisi. Nulla mollis, enim vitae aliquet blandit, quam massa bibendum urna, at facilisis mi nulla id enim.
            Nunc ullamcorper sed nisl sit amet feugiat. Nullam nisi dolor, suscipit at felis nec, mattis convallis odio. Donec venenatis sollicitudin iaculis.
            Aliquam ultrices elit sed malesuada mattis. Fusce malesuada, elit quis ultricies pulvinar, justo tortor convallis lacus, eget pharetra ligula
            ipsum at nisi. Aenean turpis massa, dignissim nec lobortis in, maximus et elit. Sed metus mi, tempus a suscipit in, congue sit amet enim. Praesent
            vehicula efficitur maximus. Phasellus dictum mi dignissim leo maximus, non mollis augue blandit.
          </p>
        </div>
      </Paper>
    );
  }
}



