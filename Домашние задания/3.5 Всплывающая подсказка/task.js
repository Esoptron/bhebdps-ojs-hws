const tooltips = Array.from(document.querySelectorAll('.has-tooltip'));
let activeTooltip = null;
let activeLink = null;

tooltips.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLink === link) {
      activeTooltip.classList.remove('tooltip_active');
      activeTooltip.remove();
      activeTooltip = null;
      activeLink = null;
      return;
    }

    if (activeTooltip) {
      activeTooltip.classList.remove('tooltip_active');
      activeTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip tooltip_active';
    tooltip.textContent = link.title;
    document.body.appendChild(tooltip);

    const linkRect = link.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    tooltip.style.left = `${linkRect.left}px`;
    tooltip.style.top = `${linkRect.bottom}px`;

    if (linkRect.left + tooltipRect.width > window.innerWidth) {
      tooltip.style.left = `${window.innerWidth - tooltipRect.width}px`;
    }

    activeTooltip = tooltip;
    activeLink = link;
  });
});
