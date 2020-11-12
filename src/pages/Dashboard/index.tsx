import React, { useState, useEffect, ReactNode } from 'react';

// import { findByLabelText } from '@testing-library/react';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import house from '../../assets/house.svg';
import sell from '../../assets/sell.svg';
import food from '../../assets/food.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface TransactionsBalance {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const showIcon = React.useCallback((category: string): ReactNode => {
    if (category.toLowerCase() === 'casa' || category.toLowerCase() === 'house')
      return <img src={house} alt="House" />;

    if (
      category.toLowerCase() === 'alimentação' ||
      category.toLowerCase() === 'food'
    )
      return <img src={food} alt="Food" />;

    return <img src={sell} alt="Sell" />;
  }, []);
  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      try {
        const response = await api.get<TransactionsBalance>('/transactions');
        const {
          transactions: transactionsData,
          balance: balanceData,
        } = response.data;

        const transactionsFormatted = transactionsData.map(t => ({
          ...t,
          formattedValue:
            t.type === 'outcome'
              ? ` - ${formatValue(t.value)}`
              : formatValue(t.value),
          formattedDate: formatDate(t.created_at),
        }));

        const ballanceFormatted = {
          income: formatValue(parseFloat(balanceData.income)),
          outcome: formatValue(parseFloat(balanceData.outcome)),
          total: formatValue(parseFloat(balanceData.total)),
        };

        setTransactions(transactionsFormatted);
        setBalance(ballanceFormatted);
      } catch (err) {
        console.log(err);
      }
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            {balance.income && (
              <h1 data-testid="balance-income">{balance.income}</h1>
            )}
          </Card>

          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            {balance.outcome && (
              <h1 data-testid="balance-outcome">{balance.outcome}</h1>
            )}
          </Card>

          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            {balance.total && (
              <h1 data-testid="balance-total">{balance.total}</h1>
            )}
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(t => (
                  <tr key={t.id}>
                    <td className="title">{t.title}</td>
                    <td className={t.type}>{t.formattedValue}</td>
                    <td className="icon-category">
                      {showIcon(t.category.title)}
                      {t.category.title}
                    </td>
                    <td>{t.formattedDate}</td>
                  </tr>
                ))}

              {/* <tr>
                <td className="title">Computer</td>
                <td className="income">R$ 5.000,00</td>
                <td>Sell</td>
                <td>20/04/2020</td>
              </tr>
              <tr>
                <td className="title">Website Hosting</td>
                <td className="outcome">- R$ 1.000,00</td>
                <td>Hosting</td>
                <td>19/04/2020</td>
              </tr> */}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
