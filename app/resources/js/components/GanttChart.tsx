import React, { useState, useEffect } from 'react';
import Icon from "@mui/material/Icon";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // 「さらに表示」ボタンに使うアイコン
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // 「5件表示に戻す」ボタンに使うアイコン
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface Task {
  id: string;
  content: string;
  created_at: string;
  due_date: string;
  status: { id: string, name: string };
}

interface GanttChartProps {
  searchQuery: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ searchQuery }) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [tasks, setTasks] = useState<Task[]>([]); // タスクを格納する状態
  const [tasksToShow, setTasksToShow] = useState<Task[]>([]); // 初期表示タスク
  const [showAllTasks, setShowAllTasks] = useState(false); // すべてのタスクを表示するかどうか
  const [isTaskView, setIsTaskView] = useState(true); // タスクビューかステータスビューかを切り替える

  // タスクをデータベースから非同期で取得
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks'); // APIエンドポイントを指定
      const data = await response.json();
      setTasks(data);
      setTasksToShow(data.slice(0, 5)); // 最初は最大5件表示
    };
    fetchTasks();
  }, []);

  // 今日の日付を取得
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // その月の最初の日
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // その月の最後の日
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  // 表示する範囲を決定
  const minDate = viewMode === 'monthly' ? startOfMonth : startOfYear;
  const maxDate = viewMode === 'monthly' ? endOfMonth : endOfYear;

  // 日付リストを作成
  const dateRange: Date[] = [];
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    dateRange.push(new Date(currentDate));
    if (viewMode === 'monthly') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  // 年間表示時に幅を31に揃えるための倍率
  const yearlyScaleFactor = 31 / 12;

  // タイトルクリックでモード切り替え
  const toggleViewMode = () => {
    setViewMode(viewMode === 'monthly' ? 'yearly' : 'monthly');
  };

  // 「さらに表示する」ボタンの処理
  const handleShowAllTasks = () => {
    setTasksToShow(tasks); // すべてのタスクを表示
    setShowAllTasks(true); // ボタンの表示状態を変更
  };

  // 「5件表示に戻す」ボタンの処理
  const handleShowFiveTasks = () => {
    setTasksToShow(tasks.slice(0, 5)); // 最初の5件のみ表示
    setShowAllTasks(false); // ボタンの表示状態を変更
  };

  // 検索クエリに基づいてタスクをフィルタリング
  const filteredTasks = tasksToShow.filter(task => task.content.toLowerCase().includes(searchQuery.toLowerCase()));

  // 表示モード切り替えボタンの処理
  const toggleTaskView = () => {
    setIsTaskView(!isTaskView);
  };

  return (
    <div style={{ padding: '15px', background: '#f4f4f4', textAlign: 'center', overflowX: 'auto' }}>
      {/* タイトル（クリックで切り替え） */}
      <div style={{ display: 'flex', marginBottom: '8px', cursor: 'pointer' }}>
        <div
          style={{ width: '200px', fontWeight: 'bold' }}
          onClick={toggleViewMode}
        >
          {viewMode === 'monthly'
            ? today.toLocaleString('default', { month: 'long' }) // **月間表示：月名**
            : today.getFullYear()} {/* **年間表示：年** */}
          <SwapHorizIcon />
        </div>
        {dateRange.map((date, index) => (
          <div
            key={index}
            style={{
              width: viewMode === 'monthly' ? '30px' : `${30 * yearlyScaleFactor}px`, // **年間表示時に幅を拡大**
              textAlign: 'center',
            }}
          >
            {viewMode === 'monthly' ? date.getDate() : date.getMonth() + 1}
          </div>
        ))}
      </div>

      {/* タスクの表示 */}
      {isTaskView ? (
        filteredTasks.map(task => {
          const taskStart = new Date(task.created_at);
          const taskEnd = new Date(task.due_date);

          // **年間モード：タスクの開始日と終了日がその年の範囲に合わせて調整**
          const adjustedTaskStart = taskStart < startOfYear ? startOfYear : taskStart;
          const adjustedTaskEnd = taskEnd > endOfYear ? endOfYear : taskEnd;

          // **月間モード：タスクの開始日と終了日が月の範囲に合わせて調整**
          const adjustedTaskStartForMonth = taskStart < startOfMonth ? startOfMonth : taskStart;
          const adjustedTaskEndForMonth = taskEnd > endOfMonth ? endOfMonth : taskEnd;

          return (
            <div key={task.id} style={{ display: 'flex', marginBottom: '8px' }}>
              <div style={{
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {task.content}
              </div>
              {dateRange.map((date, index) => {
                let isWithinTaskDuration = false;

                if (viewMode === 'monthly') {
                  isWithinTaskDuration = date >= adjustedTaskStartForMonth && date <= adjustedTaskEndForMonth;
                } else {
                  isWithinTaskDuration = date >= adjustedTaskStart && date <= adjustedTaskEnd;
                }

                return (
                  <div
                    key={index}
                    style={{
                      width: viewMode === 'monthly' ? '30px' : `${30 * yearlyScaleFactor}px`,
                      height: '20px',
                      backgroundColor: isWithinTaskDuration ? 'skyblue' : 'transparent',
                      border: '1px solid #ccc',
                    }}
                  />
                );
              })}
            </div>
          );
        })
      ) : (
        // ステータスビューの表示
        Object.entries(filteredTasks.reduce((acc, task) => {
          if (!acc[task.status.name]) {
            acc[task.status.name] = [];
          }
          acc[task.status.name].push(task);
          return acc;
        }, {} as { [key: string]: Task[] })).map(([status, tasks]) => (
          <div key={status} style={{ marginBottom: '16px' }}>
            <h3>{status}</h3>
            {tasks.map(task => {
              const taskStart = new Date(task.created_at);
              const taskEnd = new Date(task.due_date);

              // **年間モード：タスクの開始日と終了日がその年の範囲に合わせて調整**
              const adjustedTaskStart = taskStart < startOfYear ? startOfYear : taskStart;
              const adjustedTaskEnd = taskEnd > endOfYear ? endOfYear : taskEnd;

              // **月間モード：タスクの開始日と終了日が月の範囲に合わせて調整**
              const adjustedTaskStartForMonth = taskStart < startOfMonth ? startOfMonth : taskStart;
              const adjustedTaskEndForMonth = taskEnd > endOfMonth ? endOfMonth : taskEnd;

              return (
                <div key={task.id} style={{ display: 'flex', marginBottom: '8px' }}>
                  <div style={{
                    width: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {task.content}
                  </div>
                  {dateRange.map((date, index) => {
                    let isWithinTaskDuration = false;

                    if (viewMode === 'monthly') {
                      isWithinTaskDuration = date >= adjustedTaskStartForMonth && date <= adjustedTaskEndForMonth;
                    } else {
                      isWithinTaskDuration = date >= adjustedTaskStart && date <= adjustedTaskEnd;
                    }

                    return (
                      <div
                        key={index}
                        style={{
                          width: viewMode === 'monthly' ? '30px' : `${30 * yearlyScaleFactor}px`,
                          height: '20px',
                          backgroundColor: isWithinTaskDuration ? 'skyblue' : 'transparent',
                          border: '1px solid #ccc',
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))
      )}

      {/* 「さらに表示する」または「5件表示に戻す」ボタン */}
      <div style={{ textAlign: 'right', marginTop: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
        {/* 表示モード切り替えボタン */}
        <button
          onClick={toggleTaskView}
          style={{
            padding: "10px",
            borderRadius: "50%",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isTaskView ? <DashboardIcon /> : <ViewListIcon />}
        </button>
        {!showAllTasks ? (
          <button
            onClick={handleShowAllTasks}
            style={{
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ArrowDownwardIcon />
          </button>
        ) : (
          <button
            onClick={handleShowFiveTasks}
            style={{
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ArrowUpwardIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default GanttChart;