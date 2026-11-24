const notes = [
  {
    id: 'field',
    title: '서울대 야구장, 인조잔디를 생각하다',
    category: 'RESEARCH QUESTION',
    symbol: '⌁',
    rank: 1,
    description: '인조잔디 전환은 선수와 이용자의 경험을 어떻게 바꿀까요? 슬라이딩 찰과상, 불규칙한 바운드로 인한 수비 부상, 흙먼지에 따른 호흡기 불편 같은 영향을 질문으로 살펴봅니다.',
    link: '질문에서 출발하기'
  },
  {
    id: 'markets',
    title: '금융·경제 데이터를 읽는 습관',
    category: 'ONGOING INTEREST',
    symbol: '↗',
    rank: 2,
    description: '금리와 환율, 정책 변화가 시장에 전해지는 흐름을 따라갑니다. 개별 수치의 움직임을 더 큰 맥락과 연결해 설명하는 데 관심이 있습니다.',
    link: '계속 배우는 중'
  },
  {
    id: 'website',
    title: '나를 소개하는 작은 웹사이트',
    category: 'LAB 7 · WEB PROJECT',
    symbol: '✳',
    rank: 3,
    description: '개인 소개와 관심 주제를 한 페이지에 담았습니다. 탐구 노트 정렬 기능은 안정적인 병합 정렬로 구현해 제목순으로 다시 배열할 수 있습니다.',
    link: 'HTML · CSS · JavaScript'
  }
];

// Stable merge sort for the interactive Title A–Z ordering control.
function mergeSort(items, compare) {
  if (items.length < 2) return items;
  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle), compare);
  const right = mergeSort(items.slice(middle), compare);
  const sorted = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) sorted.push(left[i++]);
    else sorted.push(right[j++]);
  }
  return sorted.concat(left.slice(i), right.slice(j));
}

function sortNotes(items, mode) {
  if (mode === 'title') return mergeSort(items, (a, b) => a.title.localeCompare(b.title, 'ko'));
  return mergeSort(items, (a, b) => a.rank - b.rank);
}

function render(mode = 'featured') {
  const container = document.querySelector('#notes');
  const ordered = sortNotes(notes, mode);
  container.replaceChildren(...ordered.map((note, index) => {
    const card = document.createElement('article');
    card.className = 'note-card';
    card.dataset.noteId = note.id;

    const category = document.createElement('span');
    category.className = 'note-category';
    category.textContent = note.category;

    const symbol = document.createElement('span');
    symbol.className = 'note-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = note.symbol;

    const heading = document.createElement('h3');
    heading.textContent = note.title;

    const description = document.createElement('p');
    description.textContent = note.description;

    const footer = document.createElement('span');
    footer.className = 'note-link';
    footer.textContent = `${String(index + 1).padStart(2, '0')}  /  ${note.link}`;

    card.append(category, symbol, heading, description, footer);
    return card;
  }));
}

document.querySelectorAll('.sort-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.sort-button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render(button.dataset.sort);
  });
});

render();
