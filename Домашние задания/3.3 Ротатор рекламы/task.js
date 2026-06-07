const rotators = document.querySelectorAll('.rotator');

const getDelay = (element) => Number(element.dataset.speed) || 1000;

const applyColor = (element) => {
  if (element.dataset.color) {
    element.style.color = element.dataset.color;
  }
};

const startRotator = (rotator) => {
  const cases = Array.from(rotator.querySelectorAll('.rotator__case'));

  if (cases.length === 0) {
    return;
  }

  let activeIndex = cases.findIndex((item) => item.classList.contains('rotator__case_active'));

  if (activeIndex === -1) {
    activeIndex = 0;
    cases[activeIndex].classList.add('rotator__case_active');
  }

  applyColor(cases[activeIndex]);

  const rotate = () => {
    const currentCase = cases[activeIndex];

    setTimeout(() => {
      currentCase.classList.remove('rotator__case_active');
      activeIndex = (activeIndex + 1) % cases.length;

      const nextCase = cases[activeIndex];
      nextCase.classList.add('rotator__case_active');
      applyColor(nextCase);

      rotate();
    }, getDelay(currentCase));
  };

  rotate();
};

rotators.forEach(startRotator);
