import axios from 'axios';
import axiosRetry from 'axios-retry';

const httpClient = axios.create();
axiosRetry(httpClient, {
  // retries: Infinity,
  // retryDelay: axiosRetry.exponentialDelay,
  // retryCondition: (error) =>
  //   error.response ? !/^2/g.test(error.response.status.toString()) : true,
  // onRetry: (retryCount, error, requestConfig) => {
  //   console.log(`Retrying request to ${requestConfig.url}. Retry n${retryCount}`);
  //   console.log(`Request body: ${JSON.stringify(requestConfig.data || '', null, 2)}`);
  // }
});

export { httpClient };
