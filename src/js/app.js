import axios from 'axios';
import '../scss/index.scss';

const URL_API = 'https://newsapi.org/v2/top-headlines';
const TOKEN_NEWS = '919480e7410442189b82f9bca505760a';

const cssClass = {
    full: {
        height: '100%',
        width: '100%',
        padding: 0,
        margin: 0
    }
}

const html = document.getElementsByTagName("HTML")[0];
const body = document.getElementsByTagName("BODY")[0];

// LAYOUT DA HEADER
const divHeader = document.createElement('DIV');
const divSpaceHeader = document.createElement('DIV');
const divHeaderLogo = document.createElement('DIV');
const divHeaderContentSpace = document.createElement('DIV');
const inputSearch = document.createElement('INPUT');
const h1 = document.createElement('H1');
const itemsElement = document.createElement('DIV');
const containerPage = document.createElement('DIV');

const modal = document.createElement('DIV');
const modalContent = document.createElement('DIV');
const modalButtonClose = document.createElement('SPAN');

modal.className = 'modal';
modal.id = 'myModal';

modalContent.className = 'modal-content';

modalButtonClose.className = 'close';

modalContent.appendChild(modalButtonClose);
modal.appendChild(modalContent);

const textH1 = document.createTextNode('AVANT TEST');

let itemsGlobal = [];

divSpaceHeader.style.height = '64px';
h1.style.margin = '0';
h1.style.color = 'white';

divHeader.className = 'header';
divHeaderLogo.className = 'header-logo'
divHeaderContentSpace.className = 'header-content-space';
itemsElement.className = 'item-element';
containerPage.className = 'container';
inputSearch.className = 'input-search';

inputSearch.placeholder = 'Procurar...';

const getItemsAPI = (loadMore = true) => {
    axios.get(URL_API, {
        params: {
            sources: 'techcrunch',
            apiKey: TOKEN_NEWS
        }
    })
    .then((result) => {
        if(result.data) {
            if(result.data.articles) {
                const {articles} = result.data;

                if(loadMore)
                    itemsGlobal = itemsGlobal.concat(articles);
                else
                    itemsGlobal = articles;

                setItemsElement(articles, loadMore);
            }
        }
    })
    .catch((error) => {
        console.error('[GET ITEMS] ERROR', error);
    });
}

const setItemsElement = (items, removeAll) => {
    if(!removeAll)
        itemsElement.innerHTML = '';

    const getArrayItemsElement = items.map(elm => {
        const textTitle = document.createTextNode(elm.title);
        const itemTitleElement = document.createElement('DIV');
        itemTitleElement.className = 'card-title';

        const textDescription = document.createTextNode(elm.description);
        const itemDescriptionElement = document.createElement('DIV');
        itemDescriptionElement.className = 'card-description';

        const textAuthor = document.createTextNode(elm.author);
        const itemAuthorElement = document.createElement('DIV');
        itemAuthorElement.className = 'card-author';

        const textLINK = document.createTextNode('ACESSE O LINK');
        const itemUrlElement = document.createElement('A');
        itemUrlElement.appendChild(textLINK);
        itemUrlElement.setAttribute('href', elm.url);
        itemUrlElement.setAttribute('target', '_blank');
        itemUrlElement.className = 'card-link';

        // IMAGE
        const imgUrlToImageElement = document.createElement('IMG');
        const itemUrlToImageElement = document.createElement('DIV');
        itemUrlToImageElement.className = 'card-image';
        imgUrlToImageElement.src = elm.urlToImage;

        const itemContentElement = document.createElement('DIV');
        itemContentElement.className = 'card-content';
    
        const itemElement = document.createElement('DIV');
        itemElement.className = 'card';
    
        itemTitleElement.appendChild(textTitle);
        itemDescriptionElement.appendChild(textDescription);
        itemAuthorElement.appendChild(textAuthor);
        itemUrlToImageElement.appendChild(imgUrlToImageElement);

        itemContentElement.appendChild(itemTitleElement);
        itemContentElement.appendChild(itemDescriptionElement);
        itemContentElement.appendChild(itemAuthorElement);
        itemContentElement.appendChild(itemUrlElement);
        
        itemElement.appendChild(itemUrlToImageElement);
        itemElement.appendChild(itemContentElement);

        itemElement.addEventListener('click', (e) => {
            if(!e.target.hasAttribute('href')) {
                const elementCardClick = e.path[2];

                console.log(e);

                modal.style.display = "block";

                modalContent.innerHTML = elementCardClick.children;
                
            }
        });
        
        return itemElement;
    });
    
    getArrayItemsElement.forEach(elm => {
        itemsElement.appendChild(elm);
    });
}

containerPage.addEventListener('scroll', () => {
    if (containerPage.scrollTop + containerPage.clientHeight >= containerPage.scrollHeight) {
        getItemsAPI(true);
    }
});


inputSearch.addEventListener('keyup', (e) => {
    if (e.target.value.length > 2) {
        const itemsFilter = itemsGlobal.filter(elm => {
            if(elm.title.search(e.target.value) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        setItemsElement(itemsFilter, false);
    } else {
        getItemsAPI(false);
    }
});













getItemsAPI();






h1.appendChild(textH1);

divHeaderLogo.appendChild(h1);

divHeaderContentSpace.appendChild(inputSearch);

divHeader.appendChild(divHeaderLogo);
divHeader.appendChild(divHeaderContentSpace);

containerPage.appendChild(itemsElement);

body.appendChild(divHeader);
body.appendChild(divSpaceHeader);
body.appendChild(containerPage);
body.appendChild(modal);