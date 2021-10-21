import React from 'react';

function Result(props) {
    let total = props.questions.length;
    let success = 0;
    let questions = props.questions;
    questions.forEach(q => {
        q.isCorrect = q.options.every(x => x.selected === x.isAnswer);
        if(q.isCorrect){
            success++;
        }
    })

    return (
        <div className="result">
            <h2 className="text-center font-weight-normal">Quiz Result</h2>
            {questions.map((q, index) =>
                <div key={q.id} className={`mb-2 ${q.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                    <div className="result-question">
                        <h5>{index + 1}. {q.name}</h5>
                        <div className="row">
                            {
                                q.options.map(option =>
                                    <div key={option.id} className="col-6">
                                        <input id={option.id} type="checkbox" disabled="disabled"
                                               checked={option.selected}/> {option.name}
                                    </div>
                                )
                            }
                        </div>
                        <div className={`m-1 p-1 text-bold ${q.isCorrect ? 'text-success' : 'text-danger'}`}>Câu trả
                            lời {q.isCorrect ? 'Đúng' : 'Sai'}.
                        </div>
                    </div>
                </div>
            )}
            <h3>Tổng điểm {success}/{total}</h3>
            <h4 className="alert alert-info text-center">Chúc mừng bạn đã hoàn thành bài quiz. Vui lòng chọn bài khác để
                tiếp tục</h4>
        </div>
    )
}

export default Result;
