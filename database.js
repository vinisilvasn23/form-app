import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydatabase.db' });

export const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, fullName TEXT, company TEXT, email TEXT, phone TEXT);',
        [],
        () => console.log('Tabela criada com sucesso'),
        error => console.error('Erro ao criar tabela:', error)
      );
    });
  };

export const insertUser = (fullName, company, email, phone) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO users (fullName, company, email, phone) VALUES (?, ?, ?, ?);',
      [fullName, company, email, phone],
      (_, resultSet) => {
        if (resultSet.insertId) {
          console.log('Usuário inserido com ID: ', resultSet.insertId);
        } else {
          console.log('Usuário não inserido');
        }
      },
      error => console.error('Erro ao inserir usuário:', error)
    );
  });
};

export const fetchUsers = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (_, resultSet) => {
          console.log('Rows:', resultSet.rows);
          const rows = resultSet.rows.raw();
          console.log('Rows raw:', rows);
          if (rows && rows.length > 0) {
            callback(rows);
          } else {
            console.log('Nenhum usuário encontrado');
            callback([]);
          }
        },
        error => console.error('Erro ao buscar usuários:', error)
      );
    });
  };
