        // Reactのアプリケーションを記述する
        const rootElement = document.getElementById('root');

        function App() {
            function handleButtonClick() {
                const inputElement = document.getElementById('inputBox');
                const newValue = inputElement.value;
                if (newValue) {
                    const listItem = document.createElement('li');
                    listItem.textContent = newValue;
                    document.getElementById('list').appendChild(listItem);
                    inputElement.value = '';  // テキストボックスの中身をクリアする
                }
            }

            return React.createElement('div', null,
                React.createElement('input', { type: 'text', id: 'inputBox', placeholder: '追加するテキスト' }),
                React.createElement('button', { onClick: handleButtonClick }, '追加'),
                React.createElement('ul', { id: 'list' })
            );
        }

        ReactDOM.createRoot(rootElement).render(React.createElement(App));