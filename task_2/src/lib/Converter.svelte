<script lang="ts">

  let rates;

  let convData = (async () => {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    rates = await response.json();
    return rates;
  })();

  let value1 = 0;
  let value2 = 0;
  let currency1 = "";
  let currency2 = "";

  let coefficient = 1;

  let getRates = async () => {
    if (currency1 != "" && currency2 != "") {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${currency1}`,
      );
      rates = await response.json();
      coefficient = rates.rates[currency2];
    }
  };

  let onCurrencyChange = () => {
    getRates()
  };

  //Связь инпутов

  let lastEditedField1 = () => {
    value2 = Number((Math.round(value1 * coefficient * 10000) / 10000).toFixed(4).replace(/\.?0+$/, ''));
  };

  let lastEditedField2 = () => {
    value1 = Number((Math.round(value2 / coefficient * 10000) / 10000).toFixed(4).replace(/\.?0+$/, ''));
  };

  $:value2 = Number((Math.round(value1 * coefficient * 10000) / 10000).toFixed(4).replace(/\.?0+$/, ''));
  //
</script>

{#await convData}
  <p>...Загрузка</p>
{:then data}
  <div>
    <h1>Конвертер валют:</h1>
    <div class="value">
      <input
        class="value-input"
        type="number"
        bind:value={value1}
        on:input={lastEditedField1}
      />
      <input
        class="value-input"
        type="number"
        bind:value={value2}
        on:input={lastEditedField2}
      />
    </div>
    <div>1 {currency1} = {coefficient} {currency2}</div>
    <div class="currency">
      <select
        class="currency-select"
        bind:value={currency1}
        on:change={onCurrencyChange}
      >
        {#each Object.entries(data.rates) as [key, value]}
          <option>{key}</option>
        {/each}
      </select>
      <select
        class="currency-select"
        bind:value={currency2}
        on:change={onCurrencyChange}
      >
        {#each Object.entries(data.rates) as [key, value]}
          <option>{key}</option>
        {/each}
      </select>
    </div>
  </div>
{/await}

<style>
  .value {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }

  .value-input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  .value-input:focus {
    border-color: #428bca;
    outline: none;
  }

  .currency {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }

  .currency-select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  .currency-select:focus {
    border-color: #428bca;
    outline: none;
  }

  .currency-select::after {
    content: "\25BE";
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 12px;
    pointer-events: none;
    color: #333;
  }
</style>
