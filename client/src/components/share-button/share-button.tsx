import './share-button.css';

const ShareButton = () => {
  return (
    <div class="dropdown fixed-bottom share-button">
        <button class="btn btn-secondary dropdown-toggle" type="button" 
        data-bs-toggle="dropdown" aria-expanded="false">
            Share This !
        </button>
        <ul class="dropdown-menu bg-transparent a2a_kit a2a_kit_size_32 a2a_default_style">
          <li><a class="a2a_button_linkedin"></a></li>
          <li><a class="a2a_button_twitter"></a></li>
          <li><a class="a2a_button_facebook"></a></li>
          <li><a class="a2a_button_email"></a></li>
          <li><a class="a2a_button_reddit"></a></li>
          <li><a class="a2a_button_copy_link"></a></li>
          <li><a class="a2a_dd" href="https://www.addtoany.com/share"></a></li>
        </ul>
        <script async src="https://static.addtoany.com/menu/page.js"></script>
    </div>
  );
};

export default ShareButton;
